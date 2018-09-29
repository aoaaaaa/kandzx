$(function(){
	//全局的栏目id
	var currentCId='';
	var zixuns=[];
	var option='';
	var currentId='';

	addCategoryId();

	//点击新增按钮出现新增的form表单
	$('.addBtn').click(function(){
		//清空表单，清空提示信息，addOption()-->查找栏目，追加节点，设置栏目值，显示模态框
		// option='新增';
		$('button[type=reset]').trigger('click');
		// $('select[name=infocategory]').val($('select[name=categoryId]').val());
		addOption(currentCId);
		$('.right-add').css('display','block');
	});

	//点击返回form表单消失
	$('.right-tianjia>div>span:first-child').click(function(){
		$('.right-add').css('display','none');
	});

	//点击左侧form表单消失
	$('.left-line').click(function(){
		$('.right-add').css('display','none');
	});

	//追加option，清空select父栏目中的所有内容，除了第一行，从后台获取所有栏目追加到option中
	function addOption(value){
		//value为设置的栏目值
		$('select[name=infocategory] option').remove();
		$.get({
			url:baseURL+'/index/findAllCategory',
			success:function(res){
				res.data.forEach(function(item,index){
					$('<option value="'+item.id+'">'+item.name+'</option>').appendTo($('select[name=infocategory]'));
				});
				//设置值
				$('select[name=infocategory]').val(value);
			}
		});
	}

	//给name=categoryId的select添加option，栏目信息
	function addCategoryId(){
		$('select[name=categoryId]').empty();
		$.get({
			url:baseURL+'/index/findAllCategory',
			success:function(res){
				res.data.forEach(function(item,index){
					var $option=$('<option value="'+item.id+'">'+item.name+'</option>');
					$option.appendTo($('select[name=categoryId]'));
				});
				currentCId=$('select[name=categoryId]').val();
				//通过栏目的id，获取对应的文章信息
				loadData($('select[name=categoryId]').val());
			}
		});
	}


	//根据栏目的id，获取文章数据,categoryId即栏目id
	function loadData(categoryId){
		$('.zixuntable tr:not(:first)').empty();
		var obj={
			page:0,
			pageSize:1000,
			categoryId:categoryId
		}
		$.get({
			url:baseURL+'/manager/article/findArticle',
			data:obj,
			success:function(res){
				if(res.status==200){
					//遍历数据，生成节点
					if(res.data&&res.data.list){
						zixuns=res.data.list;
						res.data.list.forEach(function(item,index){
							$(`
								<tr>
									<td>
										<input type="checkbox" value="`+item.id+`">
									</td>
									<td>`+item.title+`</td>
									<td>`+item.category.name+`</td>
									<td>`+item.liststyle+`</td>
									<td>`+(item.author?item.author:'---')+`</td>
									<td>`+(item.publishtime?item.publishtime:'---')+`</td>
									<td>`+(item.readtimes?item.readtimes:'---')+`</td>
									<td>
										<i class="iconfont icon-edit-1-copy" title="修改"></i>
										<i class="iconfont icon-shanchu" title="删除"></i>
									</td>
								</tr>
							`).appendTo($('.zixuntable'));
						});
					}
				}
				else{
					console.log(res.message);
					alert('数据加载失败');
				}
			},
			error:function(error){
				alert(error.status);
			}
		});
	};

	//给name=categoryId绑定change事件，当它发生改变的时候，获取值，拿到categoryId，去查找文章
	$('select[name=categoryId]').change(function(){
		var id=$(this).val();
		currentCId=id;
		loadData(id);
	});

	//修改
	$('.zixuntable').on({
		click:function(){
			option='修改';
			// $('.messageSpan').html('');
			currentId=$(this).closest('tr').find('input[type=checkbox]').val();
			var cat=zixuns.filter(function(item){
				return item.id==currentId;
			})[0];
			$('input[name=title]').val(cat.title);
			$('textarea[name=comment').val(cat.content);
			// $('select[name=infocategory]').val(cat.category.name);
			$('select[name=infocategory]').val(currentCId);
			$('input[name=liststyle]').val(cat.liststyle);
			addOption(function(){
				$('select[name=infocategory]').val(cat.category.name);
			});
			$('.right-add').css('display','block');
		}
	},'i[title=修改]');


	//保存
	$('.saveBtn').click(function(){
		//获取用户的数据，表单验证，不通过-->提示用户,如果通过-->保存
		console.log('dddddddddddd');
		var title=$('input[name=title]').val();
		var infocategory=$('select[name=infocategory]').val();
		var liststyle=$('input[name=liststyle]:checked').val();
		var comment=$('textarea[name=comment]').val();
		if(title&&infocategory&&liststyle&&comment){
			var obj={
				title:title,
				liststyle:liststyle,
				content:comment,
				categoryId:infocategory
			};
			if(option=='修改'){
				obj.id=currentId;
			}
			$.post({
				url:baseURL+'/manager/article/saveOrUpdateArticle',
				data:obj,
				success:function(res){
					console.log('res');
					if(res.status==200){
						console.log('保存成功');
						// loadData($('select[name=categoryId]').val('asd'));
						loadData(currentCId);
						console.log('llllllllllllllllllll');
					}
					else{
						alert('保存失败');
						console.log(res.message);
					}
				},
				error:function(error){
					console.log(error);
				}
			});
		}
		else{
			alert('请输入完整的信息');
		}
	});


	//单行删除
	$('.zixuntable').on({
		click:function(){
			currentId=$(this).closest('tr').find('input').val();
			$.get({
				url:baseURL+'/manager/article/deleteArticleById',
				data:{
					id:currentId
				},
				success:function(res){
					if(res.status==200){
						alert('删除成功');
						loadData(currentCId);
					}
					else{
						alert('删除失败');
						console.log(res.message);
					}
				},
				error:function(error){
					alert(error.status);
				}
			});
		}
	},'i[title=删除]');


	//批量删除
	$('button:contains(批量删除)').click(function(){
		var ids=$('.zixuntable input[type=checkbox]:checked').map(function(index,item){
			return $(item).val();
		}).get();
		var obj={
			ids:ids.toString()
		};
		$.post({
			url:baseURL+'/manager/article/batchDeleteArticle',
			data:obj,
			success:function(res){
				if(res.status==200){
					alert('删除成功');
					loadData(currentCId);
				}
				else{
					alert('删除失败');
					console.log(res.message);
				}
			},
			error:function(error){
				console.log(error.status);
			}
		});
	});
		

});